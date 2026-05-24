import { Pipe } from '@angular/core';

export type StarState = 'full' | 'half' | 'empty';

@Pipe({ name: 'stars', standalone: true, pure: true })
export class StarsPipe {
  transform(rating: number): StarState[] {
    const stars: StarState[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }

    return stars;
  }
}
