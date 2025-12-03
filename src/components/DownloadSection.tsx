import { useState, useEffect } from "react";
import { Download, X, Home, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";
import { toast } from "sonner";

interface DownloadSectionProps {
  fileLink: string;
  externalLink: string;
  fileName?: string;
}

const DownloadSection = ({ fileLink, externalLink, fileName }: DownloadSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (isDownloading && !downloadComplete) {
      const duration = 2000;
      const interval = 50;
      const steps = duration / interval;
      const increment = 100 / steps;
      
      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(timer);
          setDownloadComplete(true);
          toast.success("Download complete!", {
            description: fileName || "File ready"
          });
        } else {
          setProgress(currentProgress);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isDownloading, downloadComplete, fileName]);

  const handleDownload = () => {
    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);
    toast.info("Starting download...");
  };

  const handleDirectDownload = () => {
    toast.success("Direct download started!", {
      description: fileName || "File downloading..."
    });
  };

  const handleOpenInNewTab = () => {
    toast.info("Opening file preview...");
  };

  const handleCancel = () => {
    setIsDownloading(false);
    setProgress(0);
    setDownloadComplete(false);
    toast.info("Download cancelled");
  };

  const handleReturnHome = () => {
    window.location.href = externalLink;
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <ProgressBar 
        isAnimating={isDownloading} 
        progress={progress} 
        className="mb-6"
      />
      
      {/* Main Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button 
          variant="download" 
          size="xl" 
          className="flex-1"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="w-5 h-5" />
          {isDownloading ? "Downloading..." : downloadComplete ? "Download Again" : "Download Now"}
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

      {/* Alternative Download Options */}
      <div className="glass-card-subtle rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-3">Having trouble downloading? Try these options:</p>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="download" 
            size="sm"
            onClick={handleDirectDownload}
          >
            Direct Download
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-primary hover:bg-primary/90"
          >
            <Zap className="w-4 h-4 mr-2" />
            Assisted Download
          </Button>
        </div>
        <p className="text-xs text-amber-500 mt-3 flex items-center gap-1">
          <span>⚠</span> Your browser may have issues with large downloads. Use "Assisted Download" for best results.
        </p>
      </div>
    </div>
  );
};

export default DownloadSection;
