import { Component, OnInit, HostListener } from '@angular/core';
import { Note, Controller } from './models/board.models';
import { SongService } from './services/song.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  controllers: Controller[] = [];
  pageHeight = window.innerHeight;
  
  // Record Mode
  isRecordMode = false;
  notesToRecord: Note[] = [];
  timeNow: any;
  noteId = 0;
  
  //When song is playng
  notes: Note[] = [];
  actualNotesInMap: Note[] = [];
  offsetTime = 50;
  songEnded = false;

  constructor(
    private songService: SongService
  ){

  }

  ngOnInit(){
    this.initController();
    this.startSong();
  }

  initController(){
    this.controllers.push(
      {
        fillColor: '#d9534f',
        borderColor: '#b42c27',
        isKeyDown: false,
        keyCode: 65,
        keyValue: 'A',
        position: 1
      },
      {
        fillColor: '#0000ff',
        borderColor: '#0000cc',
        isKeyDown: false,
        keyCode: 83,
        keyValue: 'S',
        position: 2
      },
      {
        fillColor: '#ffeb3b',
        borderColor: '#ffe605',
        isKeyDown: false,
        keyCode: 68,
        keyValue: 'D',
        position: 3
      },
      {
        fillColor: '#4caf50',
        borderColor: '#3d8a3f',
        isKeyDown: false,
        keyCode: 74,
        keyValue: 'J',
        position: 4
      },
      {
        fillColor: '#f44336',
        borderColor: '#e91b0c',
        isKeyDown: false,
        keyCode: 75,
        keyValue: 'K',
        position: 5
      },
    );
  }

  initNotes(){
    this.songService.getTestSong()
    .subscribe((res: any) => {
      this.notes = JSON.parse(res._body);
      this.timeNow = new Date().getTime();
      this.checkNotes();
    });
  }

  checkNotes(){
    setTimeout(() => {
      for(let i=0; i< this.notes.length; i++){
        if(this.offsetTime <this.notes[i].offsetTime){
          i = this.notes.length;
        } else {
          let idx = this.actualNotesInMap.findIndex(e => e.id == this.notes[i].id);
          if(idx == -1){
            this.actualNotesInMap.push(this.notes[i]);
          }
        }
      }
      if(!!this.actualNotesInMap.length && this.actualNotesInMap[this.actualNotesInMap.length - 1].offsetTime + 5000 < this.offsetTime){
        this.songEnded = true;
      }

      if(!this.songEnded){
        if(!!this.actualNotesInMap.length){
          let idxToRemove = [];
          this.actualNotesInMap.forEach((el, idx) => {
            el.offsetTop += 6
            if(el.offsetTop > 550){
              idxToRemove.push(idx);
            }
          });

          idxToRemove.forEach((x,i) => {
            this.actualNotesInMap.splice(x,x);
            this.notes.splice(x,x);
          });
        }
      }

      if(this.notes.length && !this.songEnded){
        this.checkNotes();
        this.offsetTime += 10;
      }
    }, 10);
  }

  startSong(){
    this.initNotes();
  }

  startRecordMode(){
    this.isRecordMode = true;
    this.timeNow = new Date().getTime();
  }

  stopRecordMode(){
    this.isRecordMode = false;
    console.log(JSON.stringify(this.notesToRecord));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let kc = event.keyCode;
    const idx = this.controllers.findIndex(el => el.keyCode == event.keyCode);
    if(idx != -1){
      this.controllers[idx].isKeyDown = true;
      let left = 23;
      if(kc == 83){ left = 114;}
      if(kc == 68){ left = 205;}
      if(kc == 74){ left = 296;}
      if(kc == 75){ left = 387;}
      
      if(this.isRecordMode){
        this.notesToRecord.push({
          borderColor: this.controllers[idx].borderColor,
          fillColor: this.controllers[idx].fillColor,
          isClicked: false,
          isSpecial: false,
          point: 25,
          position: this.controllers[idx].position,
          offsetTime: new Date().getTime() - this.timeNow,
          id: this.noteId,
          offsetTop: 0,
          offsetLeft: left
        });

        this.noteId++;
      }
    }
    // A: 65 | 23px
    // S: 83 | 114
    // D: 68 | 205
    // J: 74 | 296
    // K: 75 | 387
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const idx = this.controllers.findIndex(el => el.keyCode == event.keyCode);
    if(idx != -1){
      this.controllers[idx].isKeyDown = false;
    }
  }

}
