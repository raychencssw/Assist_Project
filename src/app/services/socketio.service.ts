import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from './environment';
import { Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: any
  socketid: any
  socketResponse = new Subject<any>()
  followerResponse = new Subject<any>()
  userid: any
  constructor() { }
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('socketid', (data: any)=>{
      console.log('SOCKET ID', data)
      this.socketResponse.next(data)
    })
    this.socket.on('newFollower', (data: any)=>{
      console.log("THE RESPONSE IS", data)
      this.followerResponse.next(data)
    })
  }
  setsocketUser(user: any){
    this.userid = user
    this.socket.emit('user', user)
  }

  disconnect() {
    if (this.socket) {
      this.socket.emit('removeuser', this.userid)
      this.socket.disconnect();
    }
  }
  
}
