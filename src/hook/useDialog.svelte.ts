import { type Todo } from '../api/index'

type DialogType = 'edit' | 'delete'

interface DialogInfo {
    type: DialogType | null
    todo: Todo | null
}

let dialogInfo: DialogInfo = $state({
    type: null,
    todo: null
})

const openDialog = (dialogType: DialogType, todo: Todo) => {
    dialogInfo.type = dialogType
    dialogInfo.todo = todo
}

const closeDialog = () => {
    dialogInfo.type = null
    dialogInfo.todo = null
}

export function useDialog() {
    return {
        dialogInfo,
        openDialog,
        closeDialog
    }    
}
