import { Component } from 'solid-js'
import { useDB } from '../../../db'
import { UserInfoForm } from '../../forms/UserInfoForm'
import { Container } from '../../layout/Grid'
import { Button } from '../../ui/Button'

export const GettingStarted: Component = () => {
  const { dispatch } = useDB()
  function handleSubmit(values: UserModel.Info) {
    console.info(values)
  }

  function addBook() {
    dispatch('ping')
      .then(data => {
        console.info(data)
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  return (
    <Container>
      <Button color="accent" onClick={addBook}>Ping</Button>
      <UserInfoForm onSubmit={handleSubmit} />
    </Container>
  )
}
