import { useFormik } from 'formik'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container'
import { PAGES } from '@interface/presenters/constants'
import { IUser } from '@domain/entities/user/user.entity'
import { IFormPasswordReset, IFormPersonalInformation } from '@domain/entities/formModels/settings-form.entity'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { toast } from 'react-toastify'
import * as Yup from "yup";
import { ICompany } from '@domain/entities/company/company.entity'
import { IFormCompany } from '@domain/entities/formModels/company-form.entity'
import { Delete, Edit, AddBusiness } from '@mui/icons-material'
import CompanyModalContainer from '@interface/ui/components/modals/company-modal/company-modal.container'
import DeleteConfirmationModal from '@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container'
import { useState } from 'react'
import { formatDateTime } from '@base/core/interface/presenters/helpers'

interface ISettingsViewModel {
  currentUser: IUser | null
  companies: ICompany[]
  selectedCompany: ICompany | null
  handlePersonalInformationSubmit: (values: IFormPersonalInformation) => Promise<void>
  handlePasswordSubmit: (values: IFormPasswordReset) => Promise<void>
  handleRequestEmailVerification: () => Promise<void>
  handleRefreshCurrentUser: () => Promise<void>
  handleCompanySubmit: (values: IFormCompany) => Promise<void>
  handleDeleteCompany: (company: ICompany) => Promise<void>
  handleCompanyAction: (companyId: number) => Promise<void>
  clearCurrentCompany: () => void
}

const getFieldError = (error?: string | string[]) => {
  if (Array.isArray(error)) {
    return error.join(' ')
  }

  return error ?? ''
}

const SettingsView: React.FC<ISettingsViewModel> = (props) => {
  const [openCompanyModal, setOpenCompanyModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)

  const personalInformationFormik = useFormik<IFormPersonalInformation>({
    enableReinitialize: true,
    initialValues: {
      firstName: props.currentUser?.firstName ?? '',
      lastName: props.currentUser?.lastName ?? '',
      username: props.currentUser?.username ?? '',
      email: props.currentUser?.email ?? '',
      companyId: props.currentUser?.company?.id ?? null
    },
    onSubmit: async (values) => {
      try {
        await props.handlePersonalInformationSubmit({
          ...values,
          email: values.email.trim(),
          companyId: values.companyId
        })
        toast.success('Personal information updated successfully.')
      } catch (error) {
        if (error instanceof FormRequestError) {
          personalInformationFormik.setErrors(error.data)
          if (error.data && 'nonFieldErrors' in error.data && error.data.nonFieldErrors?.length) {
            toast.error(error.data.nonFieldErrors.join(' '))
          }
          return
        }

        throw error
      }
    }
  })

  const passwordFormik = useFormik<IFormPasswordReset>({
    initialValues: {
      newPassword1: '',
      newPassword2: '',
    },
    onSubmit: async (values, helpers) => {
      try {
        await props.handlePasswordSubmit(values)
        toast.success('Password updated successfully.')
        helpers.resetForm()
      } catch (error) {
        if (error instanceof FormRequestError) {
          passwordFormik.setErrors(error.data)
          if (error.data && 'nonFieldErrors' in error.data && error.data.nonFieldErrors?.length) {
            toast.error(error.data.nonFieldErrors.join(' '))
          }
          return
        }

        throw error
      }
    }
  })

  const handleCreateCompany = () => {
    props.clearCurrentCompany()
    setOpenCompanyModal(true)
  }

  const handleEditCompany = async (companyId: number) => {
    await props.handleCompanyAction(companyId)
    setOpenCompanyModal(true)
  }

  const handleDeleteCompany = async (companyId: number) => {
    await props.handleCompanyAction(companyId)
    setOpenDeleteModal(true)
  }

  const emailValue = personalInformationFormik.values.email.trim()
  const hasEmail = emailValue.length > 0
  const hasValidEmail = Yup.string().email().isValidSync(emailValue)
  const isEmailVerified = Boolean(
    props.currentUser?.emailVerified &&
    props.currentUser?.email &&
    props.currentUser.email.trim() === emailValue
  )
  const canChangePassword = hasValidEmail && isEmailVerified
  const hasSelectedCompanyOption = props.companies.some(
    (company) => company.id === personalInformationFormik.values.companyId
  )
  const companySelectValue = hasSelectedCompanyOption
    ? personalInformationFormik.values.companyId ?? ""
    : ""

  const handleSendVerificationEmail = async () => {
    if (!hasValidEmail) {
      personalInformationFormik.setFieldTouched('email', true, true)
      personalInformationFormik.setFieldError('email', 'Enter a valid email address before requesting verification')
      return
    }

    setVerificationLoading(true)
    try {
      await props.handlePersonalInformationSubmit({
        ...personalInformationFormik.values,
        email: emailValue
      })
      await props.handleRequestEmailVerification()
      toast.success('Verification email sent. Please check your inbox.')
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleRefreshVerificationStatus = async () => {
    setVerificationLoading(true)
    try {
      await props.handleRefreshCurrentUser()
      toast.success('Verification status refreshed.')
    } finally {
      setVerificationLoading(false)
    }
  }

  return (
    <BaseLayoutContainer currentPage={PAGES.SETTINGS.label}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Personal information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage the account information
                </Typography>
              </Stack>

              <Box component="form" onSubmit={personalInformationFormik.handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      required
                      id="firstName"
                      name="firstName"
                      label="First name"
                      value={personalInformationFormik.values.firstName}
                      onChange={personalInformationFormik.handleChange}
                      onBlur={personalInformationFormik.handleBlur}
                      error={personalInformationFormik.touched.firstName && Boolean(personalInformationFormik.errors.firstName)}
                      helperText={personalInformationFormik.touched.firstName && getFieldError(personalInformationFormik.errors.firstName)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      required
                      id="lastName"
                      name="lastName"
                      label="Last name"
                      value={personalInformationFormik.values.lastName}
                      onChange={personalInformationFormik.handleChange}
                      onBlur={personalInformationFormik.handleBlur}
                      error={personalInformationFormik.touched.lastName && Boolean(personalInformationFormik.errors.lastName)}
                      helperText={personalInformationFormik.touched.lastName && getFieldError(personalInformationFormik.errors.lastName)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      required
                      id="username"
                      name="username"
                      label="Username"
                      value={personalInformationFormik.values.username}
                      onChange={personalInformationFormik.handleChange}
                      onBlur={personalInformationFormik.handleBlur}
                      error={personalInformationFormik.touched.username && Boolean(personalInformationFormik.errors.username)}
                      helperText={personalInformationFormik.touched.username && getFieldError(personalInformationFormik.errors.username)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl
                      fullWidth
                      error={personalInformationFormik.touched.companyId && Boolean(personalInformationFormik.errors.companyId)}
                    >
                      <InputLabel id="company-label">Company</InputLabel>
                      <Select
                        labelId="company-label"
                        id="companyId"
                        name="companyId"
                        label="Company"
                        value={companySelectValue}
                        onChange={(event) => {
                          const rawValue = String(event.target.value)
                          const nextValue = rawValue === "" ? null : Number(rawValue)
                          personalInformationFormik.setFieldValue("companyId", nextValue)
                        }}
                        onBlur={personalInformationFormik.handleBlur}
                      >
                        <MenuItem value="">
                          <em>No company</em>
                        </MenuItem>
                        {props.companies.map((company) => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {personalInformationFormik.touched.companyId && getFieldError(personalInformationFormik.errors.companyId)}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      required
                      disabled={hasEmail}
                      type="email"
                      id="email"
                      name="email"
                      label="Email address"
                      value={personalInformationFormik.values.email}
                      onChange={personalInformationFormik.handleChange}
                      onBlur={personalInformationFormik.handleBlur}
                      error={personalInformationFormik.touched.email && Boolean(personalInformationFormik.errors.email)}
                      helperText={personalInformationFormik.touched.email && getFieldError(personalInformationFormik.errors.email)}
                    />
                  </Grid>
                  <Grid size={!isEmailVerified ? { xs: 12 } : { xs: 6 }}>
                    {hasEmail && !hasValidEmail && (
                      <Alert severity="warning" sx={{ borderRadius: 3 }}>
                        Enter a valid email address before sending a verification email.
                      </Alert>
                    )}
                    {hasValidEmail && !isEmailVerified && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        <Alert severity="warning" sx={{ flex: 1, borderRadius: 3 }}>
                          This email is not verified yet. Password changes stay disabled until verification is complete.
                        </Alert>
                        <Button variant="outlined" onClick={handleSendVerificationEmail} disabled={verificationLoading}>
                          Send verification email
                        </Button>
                        <Button variant="text" onClick={handleRefreshVerificationStatus} disabled={verificationLoading}>
                          Refresh status
                        </Button>
                      </Stack>
                    )}
                    {hasValidEmail && isEmailVerified && (
                      <Alert severity="success" sx={{ borderRadius: 3 }}>
                        Your email is verified. Password changes are enabled.
                      </Alert>
                    )}
                  </Grid>
                </Grid>

                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Save personal information
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Companies
                  </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddBusiness />} onClick={handleCreateCompany}>
                  Add company
                </Button>
              </Stack>

              <List sx={{ mt: 2 }}>
                {props.companies.length === 0 && (
                  <ListItem disablePadding>
                    <ListItemText
                      primary="No companies found"
                      secondary="Create your first company to make it available in user information."
                    />
                  </ListItem>
                )}

                {props.companies.map((company, index) => {
                  const isSelected = props.currentUser?.company?.id === company.id
                  return (
                    <ListItem
                      key={`comp-${index}-${company.id}`}
                      divider
                      secondaryAction={(
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit company">
                            <IconButton edge="end" onClick={() => handleEditCompany(company.id)}>
                              <Edit fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={isSelected ? "You cannot delete the company assigned to your profile." : "Delete company"}>
                            <span>
                              <IconButton
                                edge="end"
                                color="error"
                                disabled={isSelected}
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      )}
                    >
                      <ListItemText
                        primary={(
                          <Stack direction="row" justifyContent="space-between"  sx={{ mr: 5 }} spacing={1} alignItems="center">
                            <Typography fontWeight={isSelected ? 700 : 500}>
                              {company.name}
                              {isSelected && <Chip label="Current" sx={{ ml: 1 }} color="primary" size="small" />}
                            </Typography>

                            <Stack direction="column" alignItems="flex-end">
                            {company.joinedAt &&
                              <Typography variant="body2" color="text.secondary">
                                Joined: &nbsp;
                                {formatDateTime(company.joinedAt, false, true)}
                              </Typography>
                            }
                            {company.resignedAt &&
                              <Typography variant="body2" color="text.secondary">
                                Resigned: &nbsp;
                                {formatDateTime(company.resignedAt, false, true)}
                              </Typography>
                            }
                            </Stack>

                          </Stack>
                        )}
                      />
                    </ListItem>
                  )
                })}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Reset password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Password changes require a verified email address.
                </Typography>
              </Stack>

              {!isEmailVerified && (
                <Alert severity={canChangePassword ? "info" : "warning"} sx={{ mt: 3, borderRadius: 3 }}>
                  Add a valid email address and complete email verification before changing your password.'
                </Alert>
              )}
              <Divider sx={{ my: 3 }} />

              <Box component="form" onSubmit={passwordFormik.handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    required
                    id="newPassword1"
                    name="newPassword1"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordFormik.values.newPassword1}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    disabled={!canChangePassword}
                    error={passwordFormik.touched.newPassword1 && Boolean(passwordFormik.errors.newPassword1)}
                    helperText={passwordFormik.touched.newPassword1 && getFieldError(passwordFormik.errors.newPassword1)}
                  />
                  <TextField
                    fullWidth
                    required
                    id="newPassword2"
                    name="newPassword2"
                    label="Confirm new password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordFormik.values.newPassword2}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    disabled={!canChangePassword}
                    error={passwordFormik.touched.newPassword2 && Boolean(passwordFormik.errors.newPassword2)}
                    helperText={passwordFormik.touched.newPassword2 && getFieldError(passwordFormik.errors.newPassword2)}
                  />
                </Stack>

                <Button type="submit" variant="contained" color="secondary" sx={{ mt: 3 }} disabled={!canChangePassword}>
                  Update password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CompanyModalContainer
        showModal={openCompanyModal}
        handleMainModalClose={() => setOpenCompanyModal(false)}
        handleSubmit={props.handleCompanySubmit}
        selectedCompany={props.selectedCompany}
      />

      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle="Company"
        hasConfirmation={false}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedCompany) {
            const deletedCompanyId = props.selectedCompany.id
            await props.handleDeleteCompany(props.selectedCompany)

            if (personalInformationFormik.values.companyId === deletedCompanyId) {
              personalInformationFormik.setFieldValue("companyId", null)
            }
          }
        }}
      />
    </BaseLayoutContainer>
  )
}

export default SettingsView
