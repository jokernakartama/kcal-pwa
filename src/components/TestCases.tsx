import { Component } from 'solid-js'
import * as API from '../api'

const USER = 1

export const TestCases: Component = () => {

  function getUsersLIst() {
    API.getUsers()
      .then((data) => {
        console.info('GET USERS', data)
      })
      .catch(e => {
        console.error('GET USERS ERROR', e)
      })
  }

  function getNonExistingUser() {
    API.getUser(5)
      .then((u) => {
        console.info('NON EXISTED USER HAS BEEN OBTAINED WITHOUT ERRORS', u)
      })
      .catch(e => {
        console.error('GET NON EXISTING USER ERROR', e)
      })
  }

  function updateUserGoals() {
    API.setUserGoals({
      userId: USER,
      kcalories: 2500,
      proteins: 130,
      fats: 70,
      carbohydrates: 250
    })
      .then((r) => {
        console.info('setUserGoals ', r)
      })
      .catch(e => {
        console.warn('setUserGoals', e)
      })
  }

  function updateNotExistedUser() {
    API.setUser({
      id: USER,
      name: 'Zzap',
      sex: 'male',
      birthDate: '1989-12-23T00:00:00.000Z',
      weight: 70,
      height: 178,
      activity: 1.375,
      goal: 0
    })
      .then((r) => {
        console.info('setUser', r)
      })
      .catch(e => {
        console.warn('setUser', e)
      })
  }

  function addProduct() {
    API.setProduct({
      userId: USER,
      name: 'Candybar' ,
      proteins: 5,
      fats: 3,
      carbohydrates: 55,
      kcalories: 499
    })
      .then((r) => {
        console.info('setProduct ', r)
      })
      .catch(e => {
        console.warn('setProduct', e)
      })
  }

  function obtainProduct() {
    API.getProduct(4)
      .then((r) => {
        console.info('getProduct ', r)
      })
      .catch(e => {
        console.warn('getProduct', e)
      })
  }

  function getProductsLs() {
    API.getProducts(1, {
      // limit: 2,
      // offset: 1,
      sort: 'name',
      dir: 'asc',
      // name: 'C',
      id: [4, 5],
    })
      .then((r) => {
        console.info('getProduct ', r)
      })
      .catch(e => {
        console.warn('getProduct', e)
      })
  }

  function addRecipe() {
    // setRecipe({
    //   userId: USER,
    //   name: 'Pig with apples',
    //   products: [{ id: 4, mass: 80 }, { id: 6, mass: 40 }],
    //   description: 'An interesting meal'
    // })
    //   .then((r) => {
    //     console.info('setProduct ', r)
    //   })
    //   .catch(e => {
    //     console.warn('setProduct', e)
    //   })
  }

  function obtainRecipe() {
    API.getRecipe(1)
      .then((r) => {
        console.info('getProduct ', r)
      })
      .catch(e => {
        console.warn('getProduct', e)
      })
  }

  function getRecipeList() {
    API.getRecipes(1, {
      // limit: 2,
      // offset: 1,
      products: [7, 4]
      // sort: 'name',
      // dir: 'desc',
      // // name: 'C',
      // id: [4, 5],
    })
      .then((r) => {
        console.info('getProduct ', r)
      })
      .catch(e => {
        console.warn('getProduct', e)
      })
  }

  function addJournalRecord() {
    // setJournalRecord({
    //   userId: USER,
    //   date: new Date().trim(),
    //   meal: []
    // })
    //   .then((r) => {
    //     console.info('setJeurn ', r)
    //   })
    //   .catch(e => {
    //     console.warn('setQeurt', e)
    //   })
  }

  return (
    <div>
      <h2>Test Cases</h2>
      <button type="button" onClick={getNonExistingUser}>
          Запрос не юзера
      </button>{' '}
      <button type="button" onClick={updateNotExistedUser}>
          апдейт не юзера
      </button>{' '}
      <button type="button" onClick={getUsersLIst}>
        Запрос users lsist
      </button>{' '}

      <button type="button" onClick={updateUserGoals}>
        setUserGoals
      </button>{' '}<br /><br />
      <button type="button" onClick={addProduct}>
        add product
      </button>{' '}

      <button type="button" onClick={obtainProduct}>
        get product
      </button>{' '}
      <button type="button" onClick={getProductsLs}>
        getProductsList
      </button>{' '}<br /><br />

      <button type="button" onClick={addRecipe}>
        add recipe
      </button>{' '}

      <button type="button" onClick={obtainRecipe}>
        get recipe
      </button>{' '}
      <button type="button" onClick={getRecipeList}>
        getRecipes
      </button>{' '}<br /><br />

      <button type="button" onClick={addJournalRecord}>
        add Journal rec
      </button>{' '}

      <button type="button" onClick={obtainRecipe}>
        get Jornal
      </button>{' '}

    </div>
  )

}
