import { Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})

export class AuthLayoutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  @Input() variant: 'login' | 'signup' = 'login';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.spawnParticles();
    }
  }

  private spawnParticles(): void {
    const wrap = document.getElementById('auth-particles');
    if (!wrap) return;
    const colors = [
      'rgba(99,102,241,.5)', 'rgba(124,58,237,.4)',
      'rgba(245,158,11,.35)', 'rgba(255,255,255,.25)', 'rgba(52,211,153,.4)'
    ];
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        --dur:${Math.random() * 12 + 8}s;
        --delay:${Math.random() * -10}s;
        --dx:${(Math.random() - 0.5) * 200}px;
        border-radius:${Math.random() > 0.4 ? '50%' : '3px'};
      `;
      wrap.appendChild(p);
    }
  }
}