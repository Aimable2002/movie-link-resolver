import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MovieInfo from "@/components/MovieInfo";
import DownloadSection from "@/components/DownloadSection";
import AdBanner from "@/components/AdBanner";
import { Loader2, AlertCircle } from "lucide-react";

interface MovieData {
  title: string;
  file_link: string;
  external_link: string;
  file_size?: string;
  server?: string;
}

const Index = () => {
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Get the movie link from URL parameter (for testing) or use a default
        const urlParams = new URLSearchParams(window.location.search);
        const movieLink = urlParams.get('link') || 'https://websiteA.com/movies/legend-01';

        console.log("Fetching movie data for:", movieLink);

        const { data, error: fetchError } = await supabase.functions.invoke('resolve', {
          headers: {
            'x-movie-link': movieLink
          }
        });

        console.log("Response:", data);

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          setError("Failed to connect to server");
          return;
        }

        if (!data.success) {
          setError(data.message || "Movie not found");
          return;
        }

        setMovieData({
          title: data.title,
          file_link: data.file_link,
          external_link: data.external_link,
          file_size: data.file_size,
          server: data.server
        });
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading download information...</p>
        </div>
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Error</h2>
          <p className="text-muted-foreground">{error || "Movie not found"}</p>
          <p className="text-sm text-muted-foreground/60">
            The requested download link could not be resolved. Please try again from the original website.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Top Ad Banner */}
        <div className="w-full px-4 pt-4">
          <div className="max-w-5xl mx-auto">
            <AdBanner type="horizontal" />
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            {/* Left Column - Download Content */}
            <div className="flex-1 space-y-6">
              <MovieInfo 
                title={movieData.title}
                fileSize={movieData.file_size}
                server={movieData.server}
              />
              
              <DownloadSection 
                fileLink={movieData.file_link}
                externalLink={movieData.external_link}
              />
            </div>

            {/* Right Column - Side Ad */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="sticky top-4">
                <AdBanner type="square" />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-8 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Website B Download Page. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/60 max-w-lg mx-auto">
                Files hosted externally. Website B only provides redirection. We do not host or store any files on our servers.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
