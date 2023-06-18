import type { VerticalNavItems } from '@/@layouts/types'
import appAndPages from './app-and-pages'
import charts from './charts'
import forms from './forms'
import others from './others'
import uiElements from './ui-elements'

export default [ ...appAndPages, ...uiElements, ...forms, ...charts, ...others] as VerticalNavItems
