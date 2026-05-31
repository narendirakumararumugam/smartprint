import { Component, OnInit, Input, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface OwnerBenefit {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

export interface OwnerStat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-owner-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './owner-auth-layout.component.html',
  styleUrl: './owner-auth-layout.component.css'
})
export class OwnerAuthLayoutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  @Input() eyebrow = 'Trusted by 3,800+ shop owners';
  @Input() heading = 'Grow your shop with';
  @Input() headingHighlight = 'smart orders';
  @Input() subtext = 'List your shop, receive digital print orders, manage approvals and send files straight to your printer - all in one place.';

  @Input() benefits: OwnerBenefit[] = [
    { 
      icon: 'bx bx-bolt-circle', 
      iconBg: 'rgba(13,148,136,.2)', 
      iconColor: '#2dd4bf', 
      title: 'Auto-Approval & Direct Printing', 
      desc: 'Orders can skip manual review and go straight to your connected printer' 
    },
    { 
      icon: 'bx bx-bar-chart-big', 
      iconBg: 'rgba(5,150,105,.2)', 
      iconColor: '#34d399', 
      title: 'Live Revenue Dashboard', 
      desc: 'Track orders, earnings and customer stats in real time' 
    },
    { 
      icon: 'bx bx-bell', 
      iconBg: 'rgba(217,119,6,.2)', 
      iconColor: '#fbbf24', 
      title: 'Instant Order Notifications', 
      desc: 'Get push, email or SMS alerts the moment a new job comes in' 
    }
  ];

  @Input() stats: OwnerStat[] = [
    { value: '₹48K', label: 'Avg Monthly' },
    { value: '3.8K', label: 'Shops Live' },
    { value: '99.1%', label: 'Uptime' },
    { value: '4.8★', label: 'Partner Rating' }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.spawnParticles();
    }
  }

  private spawnParticles(): void {
    const wrap = document.getElementById('owner-particles');
    if (!wrap) return;
    
    const colors = [
      'rgba(13,148,136,.4)', 'rgba(5,150,105,.35)',
      'rgba(255,255,255,.15)', 'rgba(217,119,6,.25)', 'rgba(45,212,191,.3)'
    ];

    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 5 + 3;
      
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        --dur:${Math.random() * 12 + 8}s;
        --delay:${Math.random() * 14}s;
        --dx:${(Math.random() - 0.5) * 160}px;
        border-radius:${Math.random() > 0.35 ? '50%' : '3px'};
      `;
      
      wrap.appendChild(p);
    }
  }
}