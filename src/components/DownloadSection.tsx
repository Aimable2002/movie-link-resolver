import { useState, useEffect } from "react";
import { Download, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";

interface DownloadSectionProps {
  fileLink: string;
  externalLink: string;
}

const DownloadSection = ({ fileLink, externalLink }: DownloadSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isDownloading) {
      const duration = 1500; // 1.5 seconds
      const interval = 50; // Update every 50ms
      const steps = duration / interval;
      const increment = 100 / steps;
      
      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(timer);
          // Redirect after completion
          setTimeout(() => {
            window.location.href = fileLink;
          }, 200);
        } else {
          setProgress(currentProgress);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isDownloading, fileLink]);

  const handleDownload = () => {
    setIsDownloading(true);
    setProgress(0);
  };

  const handleCancel = () => {
    setIsDownloading(false);
    setProgress(0);
  };

  const handleReturnHome = () => {
    window.location.href = externalLink;
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <ProgressBar 
        isAnimating={isDownloading} 
        progress={progress} 
        className="mb-8"
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="download" 
          size="xl" 
          className="flex-1"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="w-5 h-5" />
          {isDownloading ? "Downloading..." : "Download Now"}
        </Button>
        
        <Button 
          variant="cancel" 
          size="xl" 
          className="flex-1 sm:flex-none sm:w-auto"
          onClick={handleCancel}
          disabled={!isDownloading}
        >
          <X className="w-5 h-5" />
          Cancel
        </Button>
        
        <Button 
          variant="home" 
          size="xl" 
          className="flex-1 sm:flex-none sm:w-auto"
          onClick={handleReturnHome}
        >
          <Home className="w-5 h-5" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default DownloadSection;
