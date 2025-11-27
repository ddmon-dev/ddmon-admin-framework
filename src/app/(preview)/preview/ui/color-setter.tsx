'use client';

import { useState } from 'react';

export function ColorSetter() {
  const [color, setColor] = useState('#000000');

  return <div className='fixed top-0 right-0 w-40 h-40 bg-red-500'>ColorSetter</div>;
}
