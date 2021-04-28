<template>
  <div class="autocomplete">
    <input
      type="text"
      @input="onChange"
      v-model="search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      placeholder="Enter your city name..."
    />
    <ul
      id="autocomplete-results"
      v-show="isOpen"
      class="autocomplete-results"
    >
      <li
        class="loading"
        v-if="isLoading"
      >
        Loading results...
      </li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >
        {{ result.name }} ( {{ result.country }} )
      </li>
      <li v-if="!isLoading && results.length == 0" class="no-result-found"> 
        No result found
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'CityInput',
    props: {
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        isLoading: false,
        arrowCounter: -1,
      };
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    methods: {
      setResult(result) {
        this.search = result.name;
        this.isOpen = false;
        this.$emit('input', this.search);
      },
      filterResults() {
        return new Promise((resolve) => {
           let results = this.items.filter((item) => {
                return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
            });
            resolve(results);
        });
      },
     async onChange() {
        this.$emit('input', this.search);
        if(this.search.length == 0) {
            this.isOpen = false;
            return;
        }
        if(this.search.length > 3) {
            this.isLoading = true;
            this.isOpen = true;
            setTimeout(() => {
                this.filterResults().then(result => {
                this.results = result;
                this.isLoading = false;
            });
            }, 100);
        }
        
      },
      handleClickOutside(event) {
        if (!this.$el.contains(event.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
        }
      },
      onArrowDown() {
        if (this.arrowCounter < this.results.length) {
          this.arrowCounter = this.arrowCounter + 1;
        }
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter - 1;
        }
      },
      onEnter() {
        let { name } = this.results[this.arrowCounter];
        this.search = name;
        this.isOpen = false;
        this.arrowCounter = -1;
        this.$emit('input', this.search);
      },
    },
  };
</script>

<style scoped>
  .autocomplete {
    position: relative;
  }
  .loading, .no-result-found {padding: 15px;}
  .autocomplete-results {
    padding: 0;
    margin-top: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    height: 120px;
    overflow: auto;
    border-radius: 10px;
    background: rgb(90 90 90 / 50%);
    backdrop-filter: blur( 5.5px );
    -webkit-backdrop-filter: blur( 5.5px );
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }
</style>