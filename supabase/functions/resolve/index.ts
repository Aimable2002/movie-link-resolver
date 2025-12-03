import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-movie-link',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Mock database of movies
const movies = [
  {
    title: "The Journey of Legend 01",
    external_link: "https://websiteA.com/movies/legend-01",
    file_link: "https://isatafilez.my/files/Newthi/Korea/THE_JOURNEY_OF_LEGEND_01.mp4",
    file_size: "1.2 GB",
    server: "FastServer CDN"
  },
  {
    title: "The Journey of Legend 02",
    external_link: "https://websiteA.com/movies/legend-02",
    file_link: "https://isatafilez.my/files/Newthi/Korea/THE_JOURNEY_OF_LEGEND_02.mp4",
    file_size: "1.4 GB",
    server: "FastServer CDN"
  },
  {
    title: "Dragon Warriors Episode 1",
    external_link: "https://websiteA.com/movies/dragon-01",
    file_link: "https://isatafilez.my/files/Newthi/Korea/DRAGON_WARRIORS_01.mp4",
    file_size: "980 MB",
    server: "UltraSpeed Server"
  },
  {
    title: "Mystery Night Special",
    external_link: "https://websiteA.com/movies/mystery-night",
    file_link: "https://isatafilez.my/files/Newthi/Korea/MYSTERY_NIGHT_SPECIAL.mp4",
    file_size: "2.1 GB",
    server: "Premium CDN"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Resolve endpoint called");
    
    // Read the X-MOVIE-LINK header
    const movieLink = req.headers.get('x-movie-link');
    console.log("Received X-MOVIE-LINK header:", movieLink);

    if (!movieLink) {
      console.log("No X-MOVIE-LINK header provided");
      return new Response(
        JSON.stringify({
          success: false,
          message: "X-MOVIE-LINK header is required"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Find the movie in our mock database
    const movie = movies.find(m => m.external_link === movieLink);
    console.log("Found movie:", movie ? movie.title : "Not found");

    if (!movie) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Movie not found"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    // Return movie data
    return new Response(
      JSON.stringify({
        success: true,
        title: movie.title,
        file_link: movie.file_link,
        external_link: movie.external_link,
        file_size: movie.file_size,
        server: movie.server
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in resolve function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
