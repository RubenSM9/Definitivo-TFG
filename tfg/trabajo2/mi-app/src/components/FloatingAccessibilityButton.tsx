'use client';

import { useState } from 'react';
import Script from 'next/script';

declare const BmvPlugin: any;

export default function FloatingAccessibilityButton() {
  const [open, setOpen] = useState(false);

  const handleScriptLoad = () => {
    if (typeof BmvPlugin !== 'undefined') {
      const settings = {
        color: "#7894CC",
        mode: "light",
        iconPosition: "bottomRight",
        autoDeploy: false,
        windowPosition: "right",
        iconType: "whiteRoundIcon",
        defaultLanguage: "es",
      };
      BmvPlugin.setConfig(settings);
    }
  };

  return (
    <>
      <Script
        id="bemyvega-widget"
        src='https://widget.bemyvega.com/build/bmvPlugin.js'
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </>
  );
}