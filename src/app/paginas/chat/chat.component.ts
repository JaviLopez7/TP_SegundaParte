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
  userName: string = '';  // Variable para almacenar el nombre del usuario
  conversationId: string = '';
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ServicioChatService) {}

  async ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.userId = usuario?.id || '';
    this.userName = usuario?.nombre || 'Usuario Anónimo';  // Recuperamos el nombre

    if (!this.userId || !this.userName) {
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

    // Enviar el mensaje con el nombre del usuario
    await this.chatService.sendMessage(this.conversationId, this.newMessage, this.userName);
    this.newMessage = ''; // Limpiar campo de mensaje
  }
}

