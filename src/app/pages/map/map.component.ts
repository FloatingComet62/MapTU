import { Component, ElementRef, ViewChild } from '@angular/core';
import fmt from '../../scripts/fmt'
import { buildingCodeFromLocation } from '../../scripts/building';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @ViewChild('mapSvg', { static: true }) mapSvg!: ElementRef<SVGSVGElement>;
  buildings: { id: string; readable: string; }[] = [];
  allBuildings: { id: string; readable: string; }[] = [];
  description: string = '';
  currentHighlights: string[] = [];
  refs: { [key: string]: Element } = {};
  target?: string;

  constructor(private route: ActivatedRoute) {
    this.target = this.route.snapshot.queryParams['target'];
  }

  ngOnInit(): void {
    this.mapSvg.nativeElement.querySelectorAll(':scope > *:not(.road)')
    .forEach((item) => {
      const id = item.getAttribute('id');
      if (!id) return;

      this.refs[id] = item;
      this.allBuildings.push({
        id: id,
        readable: fmt(id),
      });

      item.addEventListener('mouseenter', () => {
        this.description = fmt(id);
      });
    });
    this.buildingSearchInput("K")

    if (!this.target) return;
    console.log('To highlight via query params: ', this.target);
    const code = buildingCodeFromLocation(this.target);
    if (!code) return;
    this.highlightBuilding(code);
  }

  buildingSearchInput(searchTerm: string) {
    function containsSearchWords(building: string) {
      const terms = searchTerm.split(' ');
      for (const term of terms) {
        if (!building.includes(term)) {
          return false;
        }
      }
      return true;
    }
    this.buildings = this.allBuildings
      .filter(
        (building) => containsSearchWords(building.readable.toLowerCase())
      );
  }

  highlightBuilding(target: string) {
    // clear other highlights
    for (const currentHighlight of this.currentHighlights
         .splice(0, this.currentHighlights.length)) {
      const element: Element = this.refs[currentHighlight];
      element.classList.remove('highlighted');
    }

    this.currentHighlights.push(target);

    setTimeout(() => {
      const element: Element = this.refs[target];
      element.classList.add('highlighted');
    }, 100);
  }

  extractInput(event: Event) {
    return (event.target as HTMLInputElement).value.toLowerCase().trim();
  }
}
