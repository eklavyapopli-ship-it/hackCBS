import type { HTMLAttributes } from 'react';

export const Card = (props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${props.className ?? ''}`} />
);

export const CardHeader = (props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`${props.className ?? ''} p-4 border-b border-gray-100`} />
);

export const CardTitle = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...props} className={`${props.className ?? ''} text-lg font-semibold`} />
);

export const CardContent = (props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`${props.className ?? ''} p-4`} />
);

export default Card;
