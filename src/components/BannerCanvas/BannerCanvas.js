import React, { useEffect, useRef } from 'react';
import './BannerCanvas.css';
import HomeFlow from '../HomeFlow';

const logos = [
  'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
  'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg'
];

const BannerCanvas = () => {
  const canvasRef = useRef(null);
  const bannerRef = useRef(null);
  const logosDataRef = useRef([]);
  const logoImagesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const banner = bannerRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = banner.offsetWidth;
    canvas.height = banner.offsetHeight;

    // Preload images
    logoImagesRef.current = logos.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const generateLogosData = () => {
      const data = [];
      for (let i = 0; i < 75; i++) {
        data.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 20 + 10,
          opacity: Math.random() * 0.3 + 0.3,
          logo: logoImagesRef.current[Math.floor(Math.random() * logoImagesRef.current.length)]
        });
      }
      logosDataRef.current = data;
    };

    const animateLogos = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      logosDataRef.current.forEach(logo => {
        logo.x += logo.dx;
        logo.y += logo.dy;

        // Bounce off walls
        if (logo.x <= 0 || logo.x + logo.size >= canvas.width) logo.dx *= -1;
        if (logo.y <= 0 || logo.y + logo.size >= canvas.height) logo.dy *= -1;

        ctx.globalAlpha = logo.opacity;
        ctx.drawImage(logo.logo, logo.x, logo.y, logo.size, logo.size);
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animateLogos);
    };

    const handleMouseMove = (event) => {
      const mouse = {
        x: event.pageX - banner.getBoundingClientRect().left,
        y: event.pageY - banner.getBoundingClientRect().top
      };

      logosDataRef.current.forEach(logo => {
        const distance = Math.sqrt((mouse.x - logo.x) ** 2 + (mouse.y - logo.y) ** 2);
        if (distance < 150) {
          ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(logo.x + logo.size / 2, logo.y + logo.size / 2);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    };

    const handleResize = () => {
      canvas.width = banner.offsetWidth;
      canvas.height = banner.offsetHeight;
      generateLogosData();
    };

    generateLogosData();
    animateLogos();

    banner.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      banner.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="banner" ref={bannerRef}>
      <HomeFlow />
      <canvas id="dotsCanvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default BannerCanvas;
