import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './components/posts/posts.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

const routes: Routes = [
  { path: '', component: PostsComponent },
  {
    path: 'post/:id',
    loadChildren: () => import('./components/post-detail/post-detail.module').then(m => m.PostDetailModule)
  },
  { path: 'post/edit/:id', component: EditPostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
