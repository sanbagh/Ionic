import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private subject = new Subject<Recipe[]>();
  $notifier = this.subject.asObservable();
  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad'],
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg/1024px-Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes'],
    },
  ];
  constructor() {}
  getAllRecipes() {
    return [...this.recipes];
  }
  getRecipeById(id: string) {
    return { ...this.recipes.find((x) => x.id === id) };
  }
  deleteRecipe(id: string) {
    this.recipes = this.recipes.filter((x) => x.id !== id);
    this.subject.next(this.getAllRecipes());
  }
}
