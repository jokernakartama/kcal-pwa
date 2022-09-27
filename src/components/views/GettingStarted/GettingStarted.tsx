import { Component } from 'solid-js'
import { setUser, setUserGoals } from '../../../api'
import { useStore } from '../../../store'
import { getBasalMetabolicRate, getEnergy, getNutrientMassValue } from '../../../utils/calculations'
import { UserInfoForm } from '../../forms/UserInfoForm'
import { Container } from '../../layout/Grid'

export const GettingStarted: Component = () => {
  const [, setStore] = useStore()

  function handleSubmit(values: UserModel.Info) {
    setUser(values)
      .then((user) => {
        setStore({ user })

        return user
      })
      .then((user) => {
        const age = (new Date()).getFullYear() - (new Date(user.birthDate)).getFullYear()
        const bmr = getBasalMetabolicRate(
          user.weight,
          user.height,
          age,
          user.sex === 'male'
        )
        const energy = getEnergy(user.activity, bmr, user.goal)
        return setUserGoals({
          userId: user.id,
          kcalories: Math.round(energy),
          proteins: Math.round(getNutrientMassValue('proteins', energy)),
          fats: Math.round(getNutrientMassValue('fats', energy)),
          carbohydrates: Math.round(getNutrientMassValue('carbohydrates', energy))
        })
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
