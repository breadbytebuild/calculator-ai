import React, { useState, useEffect } from 'react';

function ImageGenerator({ duration }) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const generateImage = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      console.log('Initiating image generation for duration:', duration);
      
      // Commented out API call to Replicate
      /*
      try {
        const response = await fetch('http://localhost:3001/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `A person celebrating ${duration} of sobriety, inspirational, uplifting`,
          }),
        });
        const data = await response.json();
        
        if (isMounted) {
          setImageUrl(data.imageUrl);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error generating image:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
      */

      // Placeholder behavior
      setTimeout(() => {
        if (isMounted) {
          setImageUrl('https://via.placeholder.com/300x300?text=Sobriety+Celebration');
          setIsLoading(false);
        }
      }, 2000); // Simulate a 2-second delay
    };

    const timer = setInterval(generateImage, 20000);
    generateImage(); // Generate first image immediately

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [duration]);

  return (
    <div className="card image-card">
      <h2>Celebration Image</h2>
      {imageUrl && !isLoading ? (
        <img src={imageUrl} alt="Sobriety celebration" className="generated-image" />
      ) : (
        <div className="loading">Generating image...</div>
      )}
    </div>
  );
}

export default ImageGenerator;