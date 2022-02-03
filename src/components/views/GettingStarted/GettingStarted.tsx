import { Component } from 'solid-js'
import { UserInfoForm } from '../../forms/UserInfoForm'
import { Container } from '../../layout/Grid'

export const GettingStarted: Component = () => {
  function handleSubmit(values: UserModel.Info) {
    console.info(values)
  }

  return (
    <Container>
      <UserInfoForm onSubmit={handleSubmit} />
    </Container>
  )
}
