export interface FavoriteAddress {
    address: string;
    position: string;
    note?: string;
  }
  
  export class FavoritesManager {
    private static STORAGE_KEY = 'everyip-favorites';
  
    static getFavorites(): FavoriteAddress[] {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  
    static addFavorite(favorite: FavoriteAddress) {
      const favorites = this.getFavorites();
      if (!favorites.some(f => f.address === favorite.address)) {
        favorites.push(favorite);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      }
    }
  
    static removeFavorite(address: string) {
      const favorites = this.getFavorites();
      const filtered = favorites.filter(f => f.address !== address);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }
  
    static isFavorite(address: string): boolean {
      return this.getFavorites().some(f => f.address === address);
    }
  }