import classNames from 'classnames'
import { Component, createMemo, JSX, Match, Show, splitProps, Switch } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { useStore } from '../../../store'
import { getDiffInYears } from '../../../utils/date'
import { Loader } from '../../ui/Loader'
import styles from './styles.sass'

type UserBriefComponent = Component<
JSX.IntrinsicElements['div']
>

export const UserBrief: UserBriefComponent = props => {
  const [local, rest] = splitProps(props, ['class'])
  const t = useT()
  const [store] = useStore()
  const age = createMemo(() => {
    if (!store.user?.birthDate) return 0

    const birthdate = new Date(store.user.birthDate)

    return Math.abs(Math.ceil(getDiffInYears(birthdate, new Date())))
  })

  return (
    <div class={classNames(styles.wrapper, local.class)} {...rest}>
      <span class={styles.sex}>
        <Switch fallback={<Loader style={{ width: '1.5em' }} />}>
          <Match when={store.user?.sex === 'male'} >
            {emoji.man.html}
          </Match>
          <Match when={store.user?.sex === 'female'} >
            {emoji.woman.html}
          </Match>
        </Switch>
      </span>
      <span class={styles.name}>
        <Show when={store.user?.name} fallback={<Loader style={{ width: '3em' }} />}>
          {store.user!.name}
        </Show>
      </span>
      <span class={styles.age}>
        <Show when={age() > 0} fallback={<Loader style={{ width: '2em' }} />}>
          ,&nbsp;&nbsp;{age()} {t('unit.yearsold')}
        </Show>
      </span>
    </div>
  )
}
