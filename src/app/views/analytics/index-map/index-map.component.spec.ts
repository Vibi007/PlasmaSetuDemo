import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMapComponent } from './index-map.component';

describe('IndexMapComponent', () => {
  let component: IndexMapComponent;
  let fixture: ComponentFixture<IndexMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
