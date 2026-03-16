import RetrieveCategoryOverviewUseCase, { IRetrieveCategoryOverviewDataGateway, IRetrieveCategoryOverviewRepository } from './retrieve-category-overview.usecase';
import CategoryOverviewEntity, { ICategoryOverview } from '@domain/entities/dashboard/category-overview.entity';

describe('Test RetrieveCategoryOverviewUseCase', () => {
  let mockGateway: jest.Mocked<IRetrieveCategoryOverviewDataGateway>;
  let mockRepository: jest.Mocked<IRetrieveCategoryOverviewRepository>;
  let useCase: RetrieveCategoryOverviewUseCase;

  beforeEach(() => {
    mockGateway = {
      retrieveCategoryOverview: jest.fn(),
    };

    mockRepository = {
      retrieveCategoryOverview: jest.fn(),
    };
  });

  /**
   * Given: The data gateway returns a list of categories
   * Expect: The repository receives the same list
   */
  test('Execute successfully retrieves and stores category overview', async () => {
    // Arrange
    const mockCategories: ICategoryOverview[] = CategoryOverviewEntity.mock().getCurrentValuesAsJSON();

    mockGateway.retrieveCategoryOverview.mockResolvedValue(mockCategories);

    useCase = new RetrieveCategoryOverviewUseCase(mockGateway, mockRepository);

    // Act
    await useCase.execute();

    // Assert
    expect(mockGateway.retrieveCategoryOverview).toHaveBeenCalledTimes(1);
    expect(mockRepository.retrieveCategoryOverview).toHaveBeenCalledWith(mockCategories);
  });

  /**
   * Given: The data gateway throws an error
   * Expect: The repository is not called
   */
  test('Execute handles gateway errors gracefully', async () => {
    // Arrange
    const simulatedError = new Error('Failed to fetch categories');
    mockGateway.retrieveCategoryOverview.mockRejectedValue(simulatedError);

    useCase = new RetrieveCategoryOverviewUseCase(mockGateway, mockRepository);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow(simulatedError);
    expect(mockRepository.retrieveCategoryOverview).not.toHaveBeenCalled();
  });
});