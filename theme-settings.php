<?php

/**
 * @file
 * Theme settings can be found here.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function madrone_form_system_theme_settings_alter(&$form, FormStateInterface $form_state, $form_id = NULL) {
  // Work-around for a core bug affecting admin themes. See issue #943212.
  if (isset($form_id)) {
    return;
  }

  $form['madrone_settings']['madrone_utilities'] = [
    '#type' => 'fieldset',
    '#title' => t('Madrone Utilities'),
  ];
  $form['madrone_settings']['madrone_utilities']['madrone_front_title'] = [
    '#type' => 'checkbox',
    '#title' => t('Hide Title'),
    '#default_value' => theme_get_setting('madrone_front_title'),
    '#description' => t('Hide the node title on front page.'),
  ];
  $form['madrone_settings']['madrone_utilities']['madrone_monsido_site_id'] = [
    '#type'          => 'textfield',
    '#title'         => t('Monsido Site Id'),
    '#default_value' => theme_get_setting('madrone_monsido_site_id'),
    '#description'   => t("Site Id for monsido analytics"),
  ];
}
