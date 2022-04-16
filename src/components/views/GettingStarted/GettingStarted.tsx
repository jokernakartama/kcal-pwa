import { Component } from 'solid-js'
import { createUser } from '../../../api/api'
import { useStore } from '../../../store'
import { UserInfoForm } from '../../forms/UserInfoForm'
import { Container } from '../../layout/Grid'

export const GettingStarted: Component = () => {
  const [, setStore] = useStore()

  function handleSubmit(values: UserModel.Info) {
    createUser(values)
      .then((user) => {
        setStore({ user })
      })
      .catch(e => {
        console.warn(e)
      })
  }

  return (
    <Container>
      <UserInfoForm onSubmit={handleSubmit} />
    </Container>
  )
}
