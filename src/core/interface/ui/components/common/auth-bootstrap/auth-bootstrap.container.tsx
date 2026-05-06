import { useEffect } from 'react'
import AuthApiGateway from '@data/gateways/api/services/auth.gateway'
import AuthRepository from '@data/gateways/api/services/auth.repository'
import RetrieveCurrentUserUseCase from '@domain/usecases/auth/retrieve-current-user.usecase'
import { useAppSelector } from '@interface/presenters/store/hooks'
import { tokenStorage } from '@data/infra/token-storage'

export const AuthBootstrapContainer: React.FC = () => {
  const initialized = useAppSelector((state) => state.authState.initialized)
  const currentUser = useAppSelector((state) => state.authState.user)

  useEffect(() => {
    if (initialized || currentUser) {
      return
    }

    const repository = new AuthRepository()

    if (!tokenStorage.hasAccessToken()) {
      repository.setInitialized(true)
      return
    }

    const useCase = new RetrieveCurrentUserUseCase(
      new AuthApiGateway(),
      repository
    )

    useCase.execute().catch(() => {
      tokenStorage.removeAccessToken()
    })
  }, [currentUser, initialized])

  return null
}

export default AuthBootstrapContainer
