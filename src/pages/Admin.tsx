import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMovies, addMovie, updateMovie, deleteMovie, Movie } from "@/data/mockMovies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Film } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState(getMovies());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    file_link: "",
    external_link: "",
    file_size: "",
    server: ""
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      file_link: "",
      external_link: "",
      file_size: "",
      server: ""
    });
    setEditingMovie(null);
  };

  const handleOpenDialog = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        file_link: movie.file_link,
        external_link: movie.external_link,
        file_size: movie.file_size,
        server: movie.server
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMovie) {
      updateMovie(editingMovie.id, formData);
      toast.success("Movie updated successfully");
    } else {
      addMovie(formData);
      toast.success("Movie added successfully");
    }
    
    setMovies(getMovies());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      deleteMovie(id);
      setMovies(getMovies());
      toast.success("Movie deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Movie Management</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Movie
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Movie title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file_link">File Link (Direct Download URL)</Label>
                      <Input
                        id="file_link"
                        value={formData.file_link}
                        onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="external_link">External Link (Website A URL)</Label>
                      <Input
                        id="external_link"
                        value={formData.external_link}
                        onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                        placeholder="https://websiteA.com/movies/..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="file_size">File Size</Label>
                        <Input
                          id="file_size"
                          value={formData.file_size}
                          onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                          placeholder="1.2 GB"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="server">Server</Label>
                        <Input
                          id="server"
                          value={formData.server}
                          onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                          placeholder="Server 1"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        {editingMovie ? "Update" : "Add"} Movie
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell className="font-medium">{movie.title}</TableCell>
                      <TableCell>{movie.file_size}</TableCell>
                      <TableCell>{movie.server}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDialog(movie)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(movie.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
