import type { TextareaHTMLAttributes } from 'react';

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 ${props.className ?? ''}`}
    />
  );
};

export default Textarea;
