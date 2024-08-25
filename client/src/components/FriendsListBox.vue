<template>
    <div class="friendlist-container">
      <table class="friendlist-table">
        <tbody>
          <tr v-for="friend in list" :key="friend.id">
            <td>{{ friend.name }}</td>
            <td>{{ friend.rating }}</td>
            <td>{{ friend.score }}</td>
            <td><font-awesome-icon 
                :icon="statusIcon(friend.status)" 
                :style="styleIcon(friend.status)"
                class="fa-2x"
                />
                <button v-if="friend.status=='battle'"  class="btnMsg">
                        <font-awesome-icon :icon="['fas', 'eye']" />
                    </button>
            </td>
            <td>
              <button class="btnMsg">
                  <font-awesome-icon :icon="['fas', 'envelope']" />
              </button>
             
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="addFriend">Add friend</button>
</template>
  
<script setup lang="ts">
import type { FriendsListType } from '@/types/FriendsListType'

const props = defineProps<{
    list: FriendsListType[]
}>()

const iconsArr: { [key: string]: string[] } =  {
    'rest'          : ['fas','globe'],
    'battle'        : ['fas', 'gamepad'],
    'online'        : ['fas', 'face-smile'],
}

const statusArr: { [key: string]: object } =  {
            'rest'          : { color: 'red' },
            'battle'        : { color: 'blue' },
            'online'        : { color: 'green' },
        }

const statusIcon = (status:string) =>{
    return iconsArr[status] || ['far', 'globe']
}

const styleIcon = (status:string) =>{
   
        return statusArr[status] || { color: 'yellow' }
}



</script>


<style scoped>
.friendlist-container {
  width: 100%;
  overflow-x: auto;
}

.friendlist-table {
  width: 100%;
  border-collapse: collapse;
}

.friendlist-table th, .friendlist-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.btnMsg {    
  border: none; /* Без границы */
  margin: 5px;
  cursor: pointer;
  font-size: 15px; /* Размер шрифта для маленькой кнопки */
}

.addFriend {
    width: 100%;
    border-radius: 20px;
    background-color: var(--tg-theme-secondary-bg-color);
    border:1px solid 
}

</style>
