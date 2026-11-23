using System.Linq.Expressions;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Repositories;

/// <summary>
/// Tüm varlıklar için ortak okuma portu. Varlık başına ayrı arayüz yerine
/// açık generic olarak kaydedilir (bkz. Persistence/ServiceRegistration).
/// </summary>
public interface IReadRepository<T> where T : BaseEntity
{
    IQueryable<T> GetAll(bool tracking = false);
    IQueryable<T> GetWhere(Expression<Func<T, bool>> predicate, bool tracking = false);
    Task<T?> GetByIdAsync(long id, bool tracking = false, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
}

public interface IWriteRepository<T> where T : BaseEntity
{
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
    void Update(T entity);
    void Remove(T entity);
    Task<int> SaveAsync(CancellationToken cancellationToken = default);
}
