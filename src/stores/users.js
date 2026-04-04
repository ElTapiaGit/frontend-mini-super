import { defineStore } from 'pinia';
import { userService } from '../api/userService';

export const useUsersStore = defineStore('users', {
    state: () => ({
        usersList: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1
        },
        loading: false,
        error: null
    }),

    actions: {
        async fetchUsers(params = {}) {
            this.loading = true;
            this.error = null;
            
            try {
                const queryParams = {
                    page: params.page || this.pagination.currentPage,
                    pageSize: params.pageSize || this.pagination.pageSize,
                    searchTerm: params.searchTerm || ''
                };
                
                const response = await userService.getUsers(queryParams);
                
                if (response.success) {
                    this.usersList = response.data.users;
                
                    this.pagination = {
                        currentPage: response.data.currentPage,
                        pageSize: response.data.pageSize,
                        totalItems: response.data.totalItems,
                        totalPages: response.data.totalPages
                    };
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar la lista de usuarios';
            } finally {
                this.loading = false;
            }
        },

        async saveUser(userData, userId = null) {
            this.loading = true;
            try {
                if (userId) {
                    await userService.updateUser(userId, userData);
                } else {
                    await userService.createUser(userData);
                }
                await this.fetchUsers(); // Recargamos la lista tras guardar
                return { success: true };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Error al guardar el usuario' };
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(userId) {
            this.loading = true;
            try {
                await userService.deleteUser(userId);
                await this.fetchUsers(); // Recargamos la lista
                return { success: true };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Error al eliminar el usuario' };
            } finally {
                this.loading = false;
            }
        }
    }
});
