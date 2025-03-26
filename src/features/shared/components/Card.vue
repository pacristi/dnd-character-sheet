<!--
  Card Component
  A reusable component for displaying content in a card format
-->
<template>
    <div class="card" :class="{ 'no-padding': noPadding }">
      <!-- Card Header -->
      <div v-if="title || $slots.header" class="card-header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <slot v-else name="header"></slot>
      </div>
      
      <!-- Card Body -->
      <div class="card-body" :class="{ 'no-padding': bodyNoPadding }">
        <slot></slot>
      </div>
      
      <!-- Card Footer -->
      <div v-if="$slots.footer" class="card-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseCard',
    props: {
      title: {
        type: String,
        default: ''
      },
      noPadding: {
        type: Boolean,
        default: false
      },
      bodyNoPadding: {
        type: Boolean,
        default: false
      }
    }
  };
  </script>
  
  <style scoped>
  .card {
    background-color: var(--color-paper);
    border: var(--border-standard);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin-bottom: var(--spacing-md);
    overflow: hidden;
  }
  
  .card-header {
    padding: var(--spacing-sm) var(--spacing-md);
    border-bottom: var(--border-standard);
    background-color: var(--color-highlight);
  }
  
  .card-title {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-primary);
  }
  
  .card-body {
    padding: var(--spacing-md);
  }
  
  .card-body.no-padding {
    padding: 0;
  }
  
  .card-footer {
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: var(--border-standard);
    background-color: var(--color-highlight);
  }
  
  .card.no-padding .card-header,
  .card.no-padding .card-body,
  .card.no-padding .card-footer {
    padding: 0;
  }
  </style>