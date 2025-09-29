import { Component, OnInit } from '@angular/core';
import { ServicioChatService } from '../../servicios/servicio-chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Asegurate de tener esto
import { RouterLink } from '@angular/router';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';



@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {
  userId: string = '';
  userName: string = '';
  userRole: string = '';
  conversationId: string = '';
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ServicioChatService) {}

  async ngOnInit() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  this.userId = usuario?.id || '';
  this.userName = usuario?.nombre || 'Usuario Anónimo';
  this.userRole = usuario?.rol || 'user';

  if (!this.userId) {
    console.error('No se encontró el usuario en localStorage');
    return;
  }

  // Establecer conversación global compartida
  this.conversationId = 'chat-global';

  // Verificar si existe, si no, crearla
  const convDoc = doc(this.chatService['db'], 'conversations', this.conversationId); // acceso directo al db
  const docSnap = await getDoc(convDoc);
  if (!docSnap.exists()) {
    await setDoc(convDoc, {
      participants: [], // o podés guardar [this.userId] si querés
      createdAt: new Date()
    });
  }

  // Escuchar mensajes en tiempo real
  this.chatService.getMessagesRealtime(this.conversationId, (msgs) => {
    this.messages = msgs;
  });
}

  async sendMessage() {
  if (!this.conversationId || !this.newMessage.trim()) return;

  // Obtener el rol y nombre del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  //const userName = usuario?.nombre || 'Usuario';
  const userName = `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim();
  const rol_id = usuario?.rol_id;
  const userRole = rol_id === 2 ? 'Administrador' : 'Cliente';


  // Enviar el mensaje con nombre, rol y texto
  await this.chatService.sendMessage(this.conversationId, this.newMessage, userName, userRole);
  this.newMessage = '';
}

@ViewChild('messagesContainer') private messagesContainer!: ElementRef;

ngAfterViewChecked() {
  this.scrollToBottom();
}

scrollToBottom(): void {
  try {
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  } catch (err) {}
}


}

