import { Component, OnInit } from '@angular/core';
import { ServicioChatService } from '../../servicios/servicio-chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
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
    this.userName = usuario?.nombre || 'Usuario Anónimo';  // Recuperamos el nombre
    this.userRole = usuario?.rol || 'user'; // Accedemos al rol desde localStorage

    if (!this.userId) {
      console.error('No se encontró el usuario en localStorage');
      return;
    }

    const conversations = await this.chatService.getConversations(this.userId);

    if (conversations.length > 0) {
      this.conversationId = conversations[0].id;
    } else {
      this.conversationId = await this.chatService.createConversation([this.userId]);
    }

    // Carga en tiempo real
    this.chatService.getMessagesRealtime(this.conversationId, (msgs) => {
      this.messages = msgs;
    });
  }

  async sendMessage() {
  if (!this.conversationId || !this.newMessage.trim()) return;

  // Obtener el rol y nombre del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const userName = usuario?.nombre || 'Usuario';
  const userRole = usuario?.rol || 'user';  // Se asegura de que el rol esté disponible

  // Enviar el mensaje con nombre, rol y texto
  await this.chatService.sendMessage(this.conversationId, this.newMessage, userName, userRole);
  this.newMessage = '';
}

}

