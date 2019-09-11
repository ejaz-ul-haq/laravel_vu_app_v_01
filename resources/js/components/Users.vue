<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 mt-5">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>
                <div class="card-tools">
                    <button class="btn btn-success" v-on:click="addModal()" >
                        Add New
                        <i class="fa fa-user-plus fa-fw"></i>
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>type</th>
                        <th>Registered At</th>
                        <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id" >
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.type | upText}}</td>
                        <td>{{ user.created_at | myDate}}</td>
                        <td>  
                            <button v-on:click="editModal(user)"><i class="fa fa-edit blue"></i></button>  /
                            <button v-on:click="deleteUser(user.id)"><i class="fa fa-trash red"></i></button >
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div> 
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div> 
        </div>


        <!-- Modal -->
<div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" v-show="!editMode" id="exampleModalCenterTitle">Add New User</h5>
        <h5 class="modal-title" v-show="editMode" id="exampleModalCenterTitle">Update User's Info</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

    <form @submit.prevent="editMode ? editUser() : createUser()">

      <div class="modal-body">
         
        <div class="form-group">
            <input v-model="form.name" type="text" name="name" 
              placeholder="Nmae"
              class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
            <has-error :form="form" field="name"></has-error>
        </div>

        <div class="form-group">
            <input v-model="form.email" type="text" name="email" 
              placeholder="Email Address"
              class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
            <has-error :form="form" field="email"></has-error>
        </div>

        <div class="form-group">
            <textarea v-model="form.bio" type="text" name="bio" 
              placeholder="Short bio for user (optional)"
              class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
            <has-error :form="form" field="bio"></has-error>
        </div>

        <div class="form-group">
            <select v-model="form.type" name="type" id="type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                <option value="">Select User Role</option>
                <option value="admin">Admin</option>
                <option value="user">Standard User</option>
                <option value="author">Author</option>
            </select>
            <has-error :form="form" field="type"></has-error>
        </div>

        <div class="form-group">
            <input v-model="form.password" type="text" name="password" 
              placeholder="Nmae"
              class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
            <has-error :form="form" field="password"></has-error>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
        <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
      </div>

    </form>
 
    </div>

  </div>
</div>
        <!-- End Modal --> 


    </div>
</template>

<script>
    export default {

        data(){
          return{
            editMode: false,
            users: {},
            form: new Form({
              id:'',
              name: '',
              email: '',
              password: '',
              type: '',
              bio: '',
              photo: ''
            })
          }
        },
        methods: {
          loadUsers(){
            axios.get('api/user').then(({ data }) => (this.users = data.data));
          },
          addModal(){
            this.editMode = false;
            this.form.reset();
            $('#addNew').modal('show');
          },
          editModal(user){
            this.editMode = true;
            this.form.reset();
            $('#addNew').modal('show');
            this.form.fill(user);
          },
          editUser(){
            console.log('editing');
            this.$Progress.start();
            this.form.put('api/user/'+this.form.id) 
            .then(() => {
                $('#addNew').modal('hide');
                swal.fire(
                  'Updated!',
                  'INformation has been updated successfully !',
                  'success'
                )
                this.$Progress.finish();
                CustomEvent.$emit('AfterCreated');  
            })
            .catch(() => {
                this.$Progress.fail();
            });
          },
          deleteUser(id){
              swal.fire({ 
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.value) {
                  this.form.delete('api/user/'+id)
                  .then(() => {
                      swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                      CustomEvent.$emit('AfterCreated');
                  })
                  .catch(() => {
                      swal.fire({
                        title: 'Custom animation with Animate.css',
                        animation: false,
                        customClass: {
                          popup: 'animated tada'
                        }
                      })
                  });
              }
            })
          },
          createUser(){
            this.$Progress.start();
            this.form.post('api/user')
            .then(() => {    
              $('#addNew').modal('hide');
              toast.fire({
                type: 'success',
                title: 'User Created successfully'
              })
              this.$Progress.finish();
              CustomEvent.$emit('AfterCreated'); 
            })
            .catch(() => {

            })
          } 
        },
        created(){
          this.loadUsers();
          CustomEvent.$on('AfterCreated',() => {
            this.loadUsers(); 
          });
        },
        mounted() {  
            console.log('Component mounted.')
        }
    }
</script>
