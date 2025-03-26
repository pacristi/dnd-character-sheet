<template>
    <div class="character-portrait-container">
      <div class="character-portrait-sticky">
        <div class="character-portrait">
          <img
            :src="portraitSource"
            alt="Imagen del personaje"
            @error="handleImageError"
          />
          <div class="portrait-controls">
            <label for="upload-portrait" class="upload-btn">Cambiar imagen</label>
            <input
              type="file"
              id="upload-portrait"
              accept="image/*"
              class="file-input"
              @change="uploadPortrait"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'PortraitSection',
    data() {
      return {
        defaultImage: require('@/assets/images/default-character.png'),
        compressionQuality: 0.7
      }
    },
    computed: {
      ...mapState('character', ['portrait', 'basicInfo']),
      
      portraitSource() {
        return this.portrait || this.defaultImage
      }
    },
    methods: {
      ...mapMutations('character', ['SET_PORTRAIT']),
      
      handleImageError(event) {
        event.target.src = this.defaultImage
      },
      
      uploadPortrait(event) {
        const file = event.target.files[0]
        
        if (file && file.type.match('image.*')) {
          const reader = new FileReader()
          
          reader.onload = (e) => {
            // Compress the image before storing
            this.compressImage(e.target.result, (compressedImage) => {
              // Update the state
              this.SET_PORTRAIT(compressedImage)
              
              // Save to storage
              try {
                // Save character to localStorage
                this.$store.dispatch('character/saveCharacter')
                
                // Cleanup old portraits
                // cleanupOldPortraits()
              } catch (error) {
                console.error('Failed to save portrait to storage:', error)
                this.$root.$emit('show-notification', 'Failed to save portrait to storage.', 'error')
              }
            })
          }
          
          reader.onerror = () => {
            console.error('Error reading portrait file')
            this.$root.$emit('show-notification', 'Error reading image file. Please try another image.', 'error')
          }
          
          reader.readAsDataURL(file)
        }
      },
      
      compressImage(imageDataUrl, callback) {
        // Create a temporary image
        const img = new Image()
        
        img.onload = () => {
          // Calculate dimensions (max 300px while maintaining aspect ratio)
          let width = img.width
          let height = img.height
          const maxDimension = 300
          
          if (width > height && width > maxDimension) {
            height = Math.round(height * (maxDimension / width))
            width = maxDimension
          } else if (height > maxDimension) {
            width = Math.round(width * (maxDimension / height))
            height = maxDimension
          }
          
          // Create canvas and compress
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          canvas.width = width
          canvas.height = height
          
          // Draw image to canvas and export as JPEG with compression
          ctx.drawImage(img, 0, 0, width, height)
          const compressedImage = canvas.toDataURL('image/jpeg', this.compressionQuality)
          
          callback(compressedImage)
        }
        
        img.onerror = () => {
          console.error('Error loading image for compression')
          // Return original if compression fails
          callback(imageDataUrl)
        }
        
        img.src = imageDataUrl
      }
    }
  }
  </script>
  
  <style scoped>
  .character-portrait-container {
    width: 220px;
    flex-shrink: 0;
  }
  
  .character-portrait-sticky {
    position: sticky;
    top: var(--spacing-xl);
  }
  
  .character-portrait {
    background-color: var(--color-paper);
    border: var(--border-standard);
    border-radius: var(--border-radius);
    padding: var(--spacing-sm);
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .character-portrait img {
    width: 100%;
    height: auto;
    border-radius: 5px;
    object-fit: cover;
    aspect-ratio: 1/1;
    background-color: var(--color-highlight);
  }
  
  .portrait-controls {
    margin-top: var(--spacing-sm);
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .character-portrait-container {
      width: 100%;
      max-width: 220px;
      margin: 0 auto;
    }
  
    .character-portrait-sticky {
      position: relative;
      top: 0;
      margin-bottom: var(--spacing-lg);
    }
  }
  </style>