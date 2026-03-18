import { IYearOverview } from '@domain/entities/dashboard/year-overview.entity'
import RetrieveYearOverviewUseCase, {
  IRetrieveYearOverviewDataGateway,
  IRetrieveYearOverviewRepository,
} from './retrieve-year-overview.usecase'

describe('Test RetrieveYearOverviewUseCase', () => {
  let mockGateway: jest.Mocked<IRetrieveYearOverviewDataGateway>
  let mockRepository: jest.Mocked<IRetrieveYearOverviewRepository>
  let useCase: RetrieveYearOverviewUseCase

  beforeEach(() => {
    mockGateway = {
      retrieveYearOverview: jest.fn(),
    }

    mockRepository = {
      setYearOverview: jest.fn(),
    }

    useCase = new RetrieveYearOverviewUseCase(mockGateway, mockRepository)
  })

  test('Execute successfully retrieves and stores year overview', async () => {
    const overview: IYearOverview[] = [
      {
        name: 'Income',
        label: ['Jan', 'Feb'],
        data: [100, 200],
        year: '2026',
      },
    ]

    mockGateway.retrieveYearOverview.mockResolvedValue(overview)

    await useCase.execute()

    expect(mockGateway.retrieveYearOverview).toHaveBeenCalledTimes(1)
    expect(mockRepository.setYearOverview).toHaveBeenCalledWith(overview)
  })

  test('Execute throws when gateway fails and does not update repository', async () => {
    const simulatedError = new Error('Failed to retrieve year overview')
    mockGateway.retrieveYearOverview.mockRejectedValue(simulatedError)

    await expect(useCase.execute()).rejects.toThrow(simulatedError)
    expect(mockRepository.setYearOverview).not.toHaveBeenCalled()
  })
})
