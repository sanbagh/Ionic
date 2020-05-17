import { AlertController } from '@ionic/angular';
import { RecipesService } from './../recipes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe;
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: RecipesService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((x) => {
      if (!x.has('id')) {
        return;
      }
      this.recipe = this.service.getRecipeById(x.get('id'));
    });
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.service.deleteRecipe(this.recipe.id);
            this.router.navigate(['/recipes']);
          },
        },
        { text: 'Cancel' },
      ],
    });

    await alert.present();
  }
  deleteRecipe() {
    this.presentAlert();
  }
}
