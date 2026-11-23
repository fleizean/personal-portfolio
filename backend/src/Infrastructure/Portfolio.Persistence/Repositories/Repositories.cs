using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Repositories;
using Portfolio.Domain.Common;
using Portfolio.Persistence.Context;

namespace Portfolio.Persistence.Repositories;

public class ReadRepository<T>(PortfolioDbContext context) : IReadRepository<T> where T : BaseEntity
{
    private DbSet<T> Table => context.Set<T>();

    public IQueryable<T> GetAll(bool tracking = false) => tracking ? Table : Table.AsNoTracking();

    public IQueryable<T> GetWhere(Expression<Func<T, bool>> predicate, bool tracking = false) =>
        GetAll(tracking).Where(predicate);

    public Task<T?> GetByIdAsync(long id, bool tracking = false, CancellationToken cancellationToken = default) =>
        GetAll(tracking).FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public Task<bool> AnyAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default) =>
        predicate is null ? Table.AnyAsync(cancellationToken) : Table.AnyAsync(predicate, cancellationToken);
}

public class WriteRepository<T>(PortfolioDbContext context) : IWriteRepository<T> where T : BaseEntity
{
    private DbSet<T> Table => context.Set<T>();

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default) =>
        await Table.AddAsync(entity, cancellationToken);

    public Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default) =>
        Table.AddRangeAsync(entities, cancellationToken);

    public void Update(T entity) => Table.Update(entity);

    public void Remove(T entity) => Table.Remove(entity);

    public Task<int> SaveAsync(CancellationToken cancellationToken = default) => context.SaveChangesAsync(cancellationToken);
}
