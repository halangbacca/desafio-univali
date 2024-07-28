import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from 'src/app/shared/services/item/item.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  quantityInputType: string = 'number';
  quantitySuffix: string = '';
  isEditMode: boolean = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private notificationService: NotificationService
  ) {
    this.itemForm = this.fb.group({
      nome: [
        '',
        [Validators.required, Validators.maxLength(50), this.validateNome()],
      ],
      unidade: ['', Validators.required],
      quantidade: ['', this.validateQuantidade()],
      preco: ['', [Validators.required, this.validateMonetary()]],
      perecivel: [false, Validators.required],
      dataValidade: [''],
      dataFabricacao: ['', [Validators.required, this.validateManufacturing()]],
    });
  }

  ngOnInit(): void {
    this.itemForm.get('perecivel')!.valueChanges.subscribe((value) => {
      const validadeControl = this.itemForm.get('dataValidade');
      if (value) {
        validadeControl!.setValidators([
          Validators.required,
          this.validateExpiryDate(),
        ]);
      } else {
        validadeControl!.clearValidators();
        this.itemForm.get('dataValidade')!.setValue('');
      }
      validadeControl!.updateValueAndValidity();
    });

    this.itemForm.get('unidade')!.valueChanges.subscribe((value) => {
      if (value === 'Litro') {
        this.quantityInputType = 'number';
        this.quantitySuffix = 'lt';
      } else if (value === 'Quilograma') {
        this.quantityInputType = 'number';
        this.quantitySuffix = 'kg';
      } else {
        this.quantityInputType = 'number';
        this.quantitySuffix = 'un';
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.itemId = +id;
        const item = this.itemService.getItem(this.itemId);
        if (item) {
          this.itemForm.patchValue(item);
        }
      }
    });
  }

  onUnidadeChange(): void {
    this.itemForm.controls['quantidade'].updateValueAndValidity();
  }

  validateNome() {
    return (control: any) => {
      const regex = /^[a-zA-Z\s]*$/;
      return regex.test(control.value) ? null : { invalidNome: true };
    };
  }

  validateQuantidade() {
    return (control: any) => {
      const unidade = this.itemForm ? this.itemForm.get('unidade')!.value : '';
      if (unidade === 'Litro' || unidade === 'Quilograma') {
        const regex = /^\d+(\.\d{1,3})?$/;
        return regex.test(control.value) ? null : { invalidQuantity: true };
      } else if (unidade === 'Unidade') {
        const regex = /^\d+$/;
        return regex.test(control.value) ? null : { invalidQuantity: true };
      }
      return null;
    };
  }

  validateMonetary() {
    return (control: any) => {
      const regex = /^\d+(\.\d{1,2})?$/;
      return regex.test(control.value) ? null : { invalidPrice: true };
    };
  }

  validateExpiryDate() {
    return (control: any) => {
      const currentDate = new Date();
      const expiryDate = new Date(control.value);
      return expiryDate < currentDate ? { expired: true } : null;
    };
  }

  validateManufacturing() {
    return (control: any) => {
      const validade = this.itemForm
        ? this.itemForm.get('dataValidade')!.value
        : '';
      const fabricacao = new Date(control.value);
      const validadeDate = new Date(validade);
      return fabricacao > validadeDate ? { afterValidade: true } : null;
    };
  }

  get nomeErrorMessage() {
    const control = this.itemForm.get('nome');
    if (control!.hasError('required')) {
      return 'Nome do item é obrigatório.';
    } else if (control!.hasError('maxlength')) {
      return 'Nome do item não pode exceder 50 caracteres.';
    } else if (control!.hasError('invalidNome')) {
      return 'Nome do item só pode conter letras.';
    }
    return '';
  }

  get validadeErrorMessage() {
    const control = this.itemForm.get('dataValidade');
    if (control!.hasError('required')) {
      return 'Data de validade é obrigatória.';
    } else if (control!.hasError('expired')) {
      return 'O produto se encontra vencido.';
    }
    return '';
  }

  get fabricacaoErrorMessage() {
    const control = this.itemForm.get('dataFabricacao');
    if (control!.hasError('required')) {
      return 'Data de fabricação é obrigatória.';
    } else if (control!.hasError('afterValidade')) {
      return 'A data de fabricação não pode ser maior que a data de validade.';
    }
    return '';
  }

  isFormValidExceptExpiry(): boolean {
    const controls = this.itemForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        if (name === 'dataValidade' && controls[name].hasError('expired')) {
          continue;
        }
        return false;
      }
    }
    return true;
  }

  onSubmit() {
    if (this.itemForm.valid || this.isFormValidExceptExpiry()) {
      if (this.isEditMode && this.itemId !== null) {
        const updatedItem = { id: this.itemId, ...this.itemForm.value };
        this.itemService.updateItem(updatedItem);
        this.notificationService.openSnackBar(
          'Produto atualizado com sucesso!'
        );
      } else {
        this.itemService.addItem(this.itemForm.value);
        this.notificationService.openSnackBar(
          'Produto adicionado com sucesso!'
        );
      }
      this.router.navigate(['/item/listar']);
    }
  }

  onCancel() {
    this.router.navigate(['/item/listar']);
  }
}
