import CompanyApiGateway from './company.gateway'
import { mockAPIResponses } from '@data/infra/api-mock'

describe('CompanyApiGateway', () => {
  let gateway: CompanyApiGateway

  beforeEach(() => {
    gateway = new CompanyApiGateway()
  })

  test('retrieveCompanies normalizes plain array responses', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, {
      companies: [
        {
          id: 5,
          created_by: {
            id: 1,
            name: 'abe',
            first_name: 'abe first',
            last_name: 'abe last name',
            username: 'abe',
            email: 'abe@example.com'
          },
          updated_by: null,
          is_current: true,
          joined_at: '2026-01-10 12:12 PM',
          resigned_at: null,
          updated_at: '2026-05-04 12:12 PM',
          created_at: '2026-05-04 12:12 PM',
          deleted_at: null,
          name: 'Abe',
          deleted_by: null
        },
        {
          id: 2,
          created_by: {
            id: 1,
            name: 'abe',
            first_name: 'abe first',
            last_name: 'abe last name',
            username: 'abe',
            email: 'abe@example.com'
          },
          updated_by: null,
          is_current: false,
          joined_at: '2025-01-01 12:12 PM',
          resigned_at: '2025-12-31 12:12 PM',
          updated_at: '2026-05-04 11:42 AM',
          created_at: '2026-05-04 11:42 AM',
          deleted_at: null,
          name: 'Sample',
          deleted_by: null
        }
      ]
    })

    const result = await gateway.retrieveCompanies({
      page: 1,
      search: '',
      ordering: 'name',
      filterModel: ''
    })

    expect(result.results).toHaveLength(2)
    expect(result.results[0].name).toBe('Abe')
    expect(result.results[0].isCurrent).toBe(true)
    expect(result.results[0].joinedAt).toBe('2026-01-10 12:12 PM')
    expect(result.results[0].resignedAt).toBeNull()
    expect(result.results[1].name).toBe('Sample')
    expect(result.results[1].isCurrent).toBe(false)
    expect(result.results[1].joinedAt).toBe('2025-01-01 12:12 PM')
    expect(result.results[1].resignedAt).toBe('2025-12-31 12:12 PM')
    expect(result.count).toBe(2)
    expect(result.currentPageNumber).toBe(1)
    expect(result.totalPages).toBe(1)
  })
})
