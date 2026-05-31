import { Component, OnInit, AfterViewInit, OnDestroy, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';
import { OwnerTopbarService } from '../../../../core/services/owner-topbar.service';

interface Review {
  id: number;
  customer: string;
  avatar: string;
  bg: string;
  rating: number;
  comment: string;
  date: string;
  replied: boolean;
  reply?: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, ChartCardComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly topbar = inject(OwnerTopbarService);

  @ViewChild('topbarActions') topbarActions?: TemplateRef<unknown>;

  filterRating = 0;
  replyingTo: number | null = null;
  replyText = '';

  stats: { icon: string; iconBg: string; iconColor: string; label: string; value: string; trend: string; trendUp: boolean }[] = [];
  ratingDistribution: { stars: number; count: number; percent: number }[] = [];
  reviews: Review[] = [];

  ngOnInit(): void {
    // Initialize with empty/zero state suitable for a newly opened shop.
    // Real data will come from the backend via API integration.
    this.stats = [
      { icon: 'bx bxs-star', iconBg: '#fef3c7', iconColor: '#d97706', label: 'Average Rating', value: '-', trend: 'No reviews yet', trendUp: true },
      { icon: 'bx bx-message-dots', iconBg: '#ccfbf1', iconColor: '#0d9488', label: 'Total Reviews', value: '0', trend: 'Waiting for first review', trendUp: true },
      { icon: 'bx bx-happy-heart-eyes', iconBg: '#dbeafe', iconColor: '#2563eb', label: '5-Star Reviews', value: '0', trend: '0% of total', trendUp: true },
      { icon: 'bx bx-reply', iconBg: '#f3e8ff', iconColor: '#7c3aed', label: 'Response Rate', value: '-', trend: 'No replies yet', trendUp: true }
    ];

    this.ratingDistribution = [
      { stars: 5, count: 0, percent: 0 },
      { stars: 4, count: 0, percent: 0 },
      { stars: 3, count: 0, percent: 0 },
      { stars: 2, count: 0, percent: 0 },
      { stars: 1, count: 0, percent: 0 }
    ];

    this.reviews = [];
  }

  ngAfterViewInit(): void {
    if (this.topbarActions) {
      this.topbar.setActions(this.topbarActions);
    }
  }

  ngOnDestroy(): void {
    this.topbar.clearActions();
  }

  get filteredReviews(): Review[] {
    if (this.filterRating === 0) return this.reviews;
    return this.reviews.filter(r => r.rating === this.filterRating);
  }

  get unrepliedCount(): number {
    return this.reviews.filter(r => !r.replied).length;
  }

  setFilter(rating: number): void {
    this.filterRating = this.filterRating === rating ? 0 : rating;
    this.cdr.markForCheck();
  }

  startReply(reviewId: number): void {
    this.replyingTo = reviewId;
    this.replyText = '';
    this.cdr.markForCheck();
  }

  cancelReply(): void {
    this.replyingTo = null;
    this.replyText = '';
    this.cdr.markForCheck();
  }

  submitReply(review: Review): void {
    if (!this.replyText.trim()) return;
    review.replied = true;
    review.reply = this.replyText.trim();
    this.replyingTo = null;
    this.replyText = '';
    this.cdr.markForCheck();
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}