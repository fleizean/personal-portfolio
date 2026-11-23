namespace Portfolio.Application.Abstractions;

/// <summary>Admin panelinden yüklenen görsellerin saklandığı yer</summary>
public interface IImageStorage
{
    /// <summary>Görseli doğrular, rastgele bir adla saklar ve sitede kullanılacak yolu döndürür</summary>
    Task<string> SaveAsync(Stream content, long length, CancellationToken cancellationToken = default);
}
