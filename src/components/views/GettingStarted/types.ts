export interface GettingStartedForm {
  name: string
  birthDate: string
  sex: UserModel.User['sex']
  energy: number
  ratio: [
    /** Proteins */
    number,
    /** Fats */
    number,
    /** Carbs */
    number
  ]
}
