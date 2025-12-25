import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-picker',
  imports: [],
  templateUrl: './picker.component.html',
  styleUrl: './picker.component.scss'
})
export class PickerComponent implements OnInit {
  @Input({ required: true }) options!: string[];
  @Output() choosenOption = new EventEmitter<string>();
  choosenOptionStr: string = '';

  ngOnInit(): void {
    this.choosenOptionStr = this.options[0];
    this.choosenOption.emit(this.options[0]);
  }
  choose(option: MouseEvent): void {
    this.choosenOptionStr = (option.target as HTMLButtonElement).textContent || this.options[0];
    this.choosenOption.emit(this.choosenOptionStr);
  }
}
