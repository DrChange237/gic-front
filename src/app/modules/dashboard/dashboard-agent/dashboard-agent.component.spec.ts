import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardAgentComponent } from './dashboard-agent.component';

describe('DashboadDefaultComponent', () => {
  let component: DashboardAgentComponent;
  let fixture: ComponentFixture<DashboardAgentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
