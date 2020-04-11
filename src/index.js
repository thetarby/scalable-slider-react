import React from 'react'
import styles from './styles.module.css'
import {Slider} from './components/slider'
import './components/slider.css'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>{text}</div>
}
export {Slider}