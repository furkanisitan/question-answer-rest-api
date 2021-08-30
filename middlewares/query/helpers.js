const filterHelper = (query, filter) => {

    if (filter.name && filter.value) {

        const queryObject = {};
        queryObject[filter.name] = new RegExp(filter.value, "i");
        return query.where(queryObject);
    }
    return query;
}

const populateHelper = (query, populations, param) => {

    for (const populate of getPopulations(populations, param))
        query.populate(populate);
    return query;
}

const getPopulations = (populations, param) => {

    const params = param.split(',');
    return populations.filter(x => params.includes(x.path));
}

const paginationHelper = (query, pagination, total) => {

    const p = getPagination(pagination, total);
    return { query: query.skip(p.skip).limit(pagination.limit), pagination: p.pagination };
}

const getPagination = (pagination, total) => {

    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    pagination.hasPrev = start > 0;
    pagination.hasNnext = end < total

    return { pagination, skip: start }
}

module.exports = { filterHelper, populateHelper, paginationHelper };